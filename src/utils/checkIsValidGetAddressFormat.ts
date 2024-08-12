export default function checkIsValidAddressFormat(str: string): boolean {
  const regex = /^-?\d+,-?\d+,.+$/;
  return regex.test(str);
}
