const categoryLabels: Record<string, string> = {
  electronics: "Điện tử",
  jewelery: "Trang sức",
  "men's clothing": "Thời trang nam",
  "women's clothing": "Thời trang nữ",
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category.toLocaleLowerCase()] ?? category;
}
