export default function formatPrice(num: any): string {
  if (!num) return num;
  return num.toLocaleString("vi-VN");
}
