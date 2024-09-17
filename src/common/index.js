export function formatPrice (value) {
    return new Intl.NumberFormat("vi", {
      style: "currency",
      currency: "VND",
    }).format(value);
}