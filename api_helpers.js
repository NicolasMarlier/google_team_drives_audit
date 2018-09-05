const _ = require('lodash');

function apiCall(params) {
  console.log("call")
  params.resource[params.method](_.merge({}, params.params), (err, res) => {
    if (err && err == "User Rate Limit Exceeded. Rate of requests for user exceed configured project quota. You may consider re-evaluating expected per-user traffic to the API and adjust project quota limits accordingly. You may monitor aggregate quota usage and adjust limits in the API Console: https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=992877924458") {
      return setTimeout(() => listTeamDrives(drive, callback, pageToken), 100)
    }
    if (err) return console.log('The API returned an error: ' + err);

    let resData = res.data;
    if(params.key) {
      resData = resData[params.key]
    }
    if(res.data.nextPageToken) {
      apiCall(_.merge(params, {
        pageToken: res.data.nextPageToken,
        callback: (response) => {
          params.callback(response.concat(resData))
        }
      }))
    }
    else {
      params.callback(resData)
    }
  })
}

exports.listTeamDrives = (drive, callback) => {
  apiCall({
    resource: drive.teamdrives,
    key: 'teamDrives',
    method: 'list',
    params: {
      pageSize: 100
    },
    callback: callback
  })
}

exports.listFilesFromTeamDrive = (drive, teamDrive, callback) => {
  apiCall({
    resource: drive.files,
    key: 'files',
    method: 'list',
    params: {
      teamDriveId: teamDrive.id,
      includeTeamDriveItems: true,
      pageSize: 1000,
      corpora: "teamDrive",
      supportsTeamDrives: true,
      useDomainAdminAccess: true,
      fields: 'nextPageToken, files(id, name, permissionIds)',
    },
    callback: callback
  });
}

exports.processList = (list, processMethod, callback) => {
  let nextActions = [callback]
  _.each(_.reverse(list), (listItem, index) => {
    nextActions.push(() => {
      processMethod(listItem, list.length - index, () => {nextActions[index]()})
    })
  })
  nextActions[nextActions.length - 1]()
}

exports.getTeamDrivePermissionIds = (drive, teamDrive, callback) => {
  apiCall({
    resource: drive.permissions,
    key: 'permissions',
    method: 'list',
    params: {
      fileId: teamDrive.id,
      supportsTeamDrives: true,
      useDomainAdminAccess: true
    },
    callback: (permissions) => { callback(_.map(permissions, (permission) => { return permission.id })) }
  })
}

exports.getPermission = (drive, permissionId, fileId, callback) => {
  apiCall({
    resource: drive.permissions,
    method: 'get',
    params: {
      fileId: fileId,
      permissionId: permissionId,
      supportsTeamDrives: true,
      fields: 'emailAddress, domain, role, displayName',
      useDomainAdminAccess: true
    },
    callback: callback
  })
}
