const { prod, np, xm } = require('./config');

const extractOptions = {
  groups: true,
  shifts: true
};

(async () => {
  //extract groups and shifts (groups required for extract reference)
  const { shifts } = await xm.sync.ExtractData(prod, extractOptions);

  //get group name from shifts that reference at least one GROUP type member
  let groupsWithGroups = shifts
    .filter(shift => shift.members.data.some(d => d.recipient.recipientType === 'GROUP'))
    .map(({ group }) => group.targetName);

  //get unique names
  groupsWithGroups = [...new Set(groupsWithGroups)];

  //exit if 0 results
  if (groupsWithGroups.length === 0) return;

  //set xMatters flow API
  const api = '/api/integration/1/functions/cfd4f59e-d637-4df4-89ef-9dbe7c7d991/triggers';

  //create payload as your flow needs.
  const json = {
    recipients: ['jsmith'],
    subject: 'Group(s) with a Group',
    body: groupsWithGroups.map(g => '• ' + g).join('/n')
  };

  //post to the Flow
  xm.util.post(np, api, json);
})();
