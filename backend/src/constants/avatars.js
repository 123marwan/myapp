const AVATARS = ["🦊", "🐼", "🐯", "🦁", "🐨", "🐸", "🦉", "🐙", "🦄", "🐳", "🐝", "🦋"];

function isValidAvatar(value) {
  return AVATARS.includes(value);
}

module.exports = { AVATARS, isValidAvatar };