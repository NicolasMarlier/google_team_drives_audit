const _ = require('lodash');
const {google} = require('googleapis');
const apiHelpers = require('./api_helpers.js');
const chalk = require('chalk');

const FILENAME = "audit.csv"

exports.mainAudit = (auth) => {
  const drive = google.drive({version: 'v3', auth});
  console.log("Listing team drives...")
  apiHelpers.listTeamDrives(drive, (teamDrives) => {
    console.log(`${teamDrives.length} team drives found.`);
    //teamDrives = [teamDrives[0]]

    apiHelpers.processList(teamDrives, (teamDrive, index, internalCallback) => {
      console.log(chalk.blue(`Auditing team drive '${teamDrive.name}' (${index}/${teamDrives.length})`));
      auditTeamDrive(drive, teamDrive, internalCallback)
    }, () => {
      console.log("Done")
    })
  });
}



function auditTeamDrive(drive, teamDrive, callback) {
  /*if([
    'Administratif',
    'AI',
    'Archive WePopp',
    'Comptabilité',
    'Contrats Fournisseurs Signés',
    'Culture d\'Entreprise',
    'Customer Success',
    'Direction',
    'Financement',
    'Marketing',
    'Organisation',
    'Photos',
    'Pilotage Stratégique',
    'Pivot',
    'Produit',
    'Recrutement',
    'Ressources Humaines',
    'Ressources Publiques Sales / Marketing',
    'Sales',
    'Security',
    'Security - internal resources',
    'Shareholder Documents',
    'Slash',
    'Support',
    'Technical',
    'Technical - internal resources'
  ].indexOf(teamDrive.name) == -1) {
    console.log(chalk.magenta("SKIPPED"))
    callback()
    return
  }*/
  apiHelpers.listFilesFromTeamDrive(drive, teamDrive, (files) => {
    //files = [files[0], files[1]]
    console.log(`  ${files.length} files found.`);
    let owners = []

    apiHelpers.getTeamDrivePermissionIds(drive, teamDrive, (teamDrivePermissionIds) => {
      //console.log(teamDrivePermissionIds)
      apiHelpers.processList(teamDrivePermissionIds, (teamDrivePermissionId, index, spInternalCallback) => {
        apiHelpers.getPermission(drive, teamDrivePermissionId, teamDrive.id, (teamDrivePermission) => {
          if(teamDrivePermission.role == "organizer") {
            console.log(`  Owner: ${teamDrivePermission.displayName}`)
            owners.push(teamDrivePermission.displayName)
          }
          spInternalCallback()
        })
      }, () => {
        apiHelpers.appendToFile(_.concat([teamDrive.name, files.length], owners).join(";"), FILENAME)
        apiHelpers.processList(files, (file, index, internalCallback) => {

          let specialPermissionIds = _.difference(file.permissionIds, teamDrivePermissionIds);
          if(specialPermissionIds.length > 0) {

            apiHelpers.processList(specialPermissionIds, (specialPermissionsId, index, spInternalCallback) => {
              apiHelpers.getPermission(drive, specialPermissionsId, file.id, (specialPermission) => {
                let emailAddressOrDomain = specialPermission.emailAddress || specialPermission.domain || ""
                if(emailAddressOrDomain.indexOf("juliedesk.com") > -1 || emailAddressOrDomain.indexOf("wepopp.com") > -1) {
                  //console.log(`  '${file.name}'`)
                  //console.log(chalk.yellow(`      ${specialPermission.displayName} <${emailAddressOrDomain}> (${specialPermission.role})`))
                }
                else {
                  apiHelpers.appendToFile(['', file.name, `${specialPermission.displayName} <${emailAddressOrDomain}>`, specialPermission.role].join(";"), FILENAME)
                  console.log(`  '${file.name}'`)
                  console.log(chalk.red(`      ${specialPermission.displayName} <${emailAddressOrDomain}> (${specialPermission.role})`))
                }

                spInternalCallback()
              })


            }, internalCallback)
          }
          else {
            internalCallback()
          }

        }, callback)

      })
    })

  })
}
