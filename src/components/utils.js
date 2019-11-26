export const compareSemVer = (a, b) => {
  console.log(a);
  if (a === b) {
    return 0;
  }

  var a_components = a.split('.');
  var b_components = b.split('.');

  var len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (var i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
};

export const longDate = date => {
  var mydate = new Date(date);
  var month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ][mydate.getMonth()];
  var str = mydate.getUTCDate() + ' ' + month + ' ' + mydate.getFullYear();
  return str;
};

export const numDate = date => {
  var mydate = new Date(date);
  const month = mydate.getMonth() + 1;
  var str = month + '/' + mydate.getUTCDate() + '/' + mydate.getFullYear();
  return str;
};
