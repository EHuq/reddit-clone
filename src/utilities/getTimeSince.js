export default function getTimeSince(timestamp) {
  const seconds = Math.floor((new Date() - timestamp.seconds * 1000) / 1000);
  return seconds;
}
