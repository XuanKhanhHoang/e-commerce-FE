export default function formatTime(dateString: string): string {
  // Create a Date object from the date string
  let date = new Date(dateString);
  // Get the day, month, year, hours, minutes and seconds from the date object
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero-based
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  // Format the day, month, year, hours, minutes and seconds with leading zeros if needed
  let dayString = day < 10 ? "0" + day : "" + day;
  let monthString = month < 10 ? "0" + month : "" + month;
  let yearString = year < 10 ? "0" + year : "" + year;
  let hoursString = hours < 10 ? "0" + hours : "" + hours;
  let minutesString = minutes < 10 ? "0" + minutes : "" + minutes;
  let secondsString = seconds < 10 ? "0" + seconds : "" + seconds;
  // Return the normal time string in the format DD/MM/YYYY HH:MM:SS
  return (
    dayString +
    "/" +
    monthString +
    "/" +
    yearString +
    " " +
    hoursString +
    ":" +
    minutesString +
    ":" +
    secondsString
  );
}
