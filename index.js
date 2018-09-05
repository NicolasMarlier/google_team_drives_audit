const auditFunctions = require('./audit_functions.js');
const googleAuth = require('./google_auth.js');


googleAuth.startAuthorize(auditFunctions.mainAudit)

/*

function getTeamDrivePermissionIds(drive, teamDrive, callback) {
  listObjects(drive.permissions, 'permissions', (permissions) => {
    callback(_.map(permissions, (permission) => permission.id))
  }, {
    fileId: teamDrive.id
  })
}
function getPermissions(drive, permissionHashes, callback, permissionIndex=0) {
  if(permissionIndex >= permissionHashes.length) {
    callback()
  }
  else {
    drive.permissions.get(permissionHashes[permissionIndex], (err, res) => {
      if (err && err == "User Rate Limit Exceeded. Rate of requests for user exceed configured project quota. You may consider re-evaluating expected per-user traffic to the API and adjust project quota limits accordingly. You may monitor aggregate quota usage and adjust limits in the API Console: https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=992877924458") {
        setTimeout(() => listTeamDrives(drive, callback, pageToken), 100)
        return
      }
      if (err) return console.log('The API returned an error: ' + err);

      getPermissions(drive, permissionHashes, (permissions) => {
          callback(_.concat(permissions, [res.data]))
        }, permissionIndex + 1
      );
    })
  }
}
function auditFiles(drive, teamDrive, files, fileIndex, teamDrivePermissionIds, callback) {
  if(fileIndex >= files.length) {
    console.log("hoy")
    callback()
  }
  else {

    let file = files[fileIndex];
    let specialPermissionIds = _.difference(file.permissionIds, teamDrivePermissionIds);
    if(specialPermissionIds.length > 0) {
      console.log(`  '${file.name}'`)
      getPermissions(drive, _.map(specialPermissionIds, (permissionId) => {
        return {
          permissionId: permissionId,
          fileId: file.id
        }
      }), (permissions) => {
        console.log(`    ${permissions}`)
      })
      /*listObjects(drive.permissions, 'permissions', (permissions) => {
          console.log(`    ${specialPermissions}`)
          console.log(`    ${permissions}`)

      }, {
        fileId: file.id
      })
      auditFiles(drive, teamDrive, files, fileIndex + 1, teamDrivePermissionIds, callback)

    }
    else {
      auditFiles(drive, teamDrive, files, fileIndex + 1, teamDrivePermissionIds, callback)
    }
  }
}


function auditTeamDrive(drive, teamDrive, callback) {
  listFilesFromTeamDrive(drive, teamDrive, (files) => {
    console.log(`${files.length} files found.`);

    getTeamDrivePermissionIds(drive, teamDrive, (teamDrivePermissionIds) => {
      auditFiles(drive, teamDrive, files, 0, teamDrivePermissionIds, callback)
    })

    /*let permissionId = files[0].permissionIds[0]
    let permissionIds = _.uniq(_.flatten(_.map(files, (file) => file.permissionIds)))
    console.log(permissionIds)

    console.log(files[1])



    getPermission(drive, teamDrive.id, files[1].permissionIds[0], (permission) => {
      if(permission.teamDrivePermissionDetails
    })
  });
  /*if (files.length) {

    files.map((file) => {
      console.log(`${file.name} (${file.id})`);
      console.log(file.permissionIds)
      file.permissionIds.map((permissionId) => {
        drive.permissions.get({
          fileId: file.id,
          permissionId: permissionId,
          supportsTeamDrives: true,
          useDomainAdminAccess: true,
          fields: 'id, role, type, emailAddress'
        }, (err, res) => {
          console.log("ok", permissionId, res.data)
        })
      })
    });
  } else {
    console.log('No files found.');
  }

}

function getPermission(drive, fileId, permissionId, callback) {
  drive.permissions.get({
    fileId: fileId,
    permissionId: permissionId,
    supportsTeamDrives: true,
    useDomainAdminAccess: true,
    fields: 'id, emailAddress, role, type, teamDrivePermissionDetails'
  }, (err, res) => {
    if (err && err == "User Rate Limit Exceeded. Rate of requests for user exceed configured project quota. You may consider re-evaluating expected per-user traffic to the API and adjust project quota limits accordingly. You may monitor aggregate quota usage and adjust limits in the API Console: https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=992877924458") {
      setTimeout(() => listTeamDrives(drive, callback, pageToken), 100)
      return
    }
    if (err) return console.log('The API returned an error: ' + err);

    console.log(res.data)
  })
}
*/
