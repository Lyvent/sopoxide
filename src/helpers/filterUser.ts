// Helper to filter sensitive user information

const sensitiveKeys: string[] = [
  'password',
  '_id',
  // Add more if needed.
];

const filterUser = (user: object) => {
  for (var i = 0; i < sensitiveKeys.length; i++) {
    let key: string = sensitiveKeys[i];

  }

  return user;
}