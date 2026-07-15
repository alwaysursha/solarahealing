import { OrderItemType } from "@prisma/client";

export function orderItemTypeLabel(type: OrderItemType): string {
  switch (type) {
    case OrderItemType.COURSE:
      return "Course";
    case OrderItemType.WORKSHOP:
      return "Workshop";
    case OrderItemType.PRIVATE_SESSION:
      return "Private session";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
