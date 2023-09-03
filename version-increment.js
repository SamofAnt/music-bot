const fs = require('fs');
const semver = require('semver');

// Read the current version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const currentVersion = packageJson.version;

// Get the commit message
const commitMessage = process.argv[2];

// Determine the version increment based on the commit message
let versionIncrement = 'patch'; // Default to patch if no specific keyword is found
if (commitMessage.includes('major')) {
  versionIncrement = 'major';
} else if (commitMessage.includes('minor')) {
  versionIncrement = 'minor';
}

// Increment the version and update package.json
const newVersion = semver.inc(currentVersion, versionIncrement);
packageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

console.log(`Version incremented to ${newVersion}`);
