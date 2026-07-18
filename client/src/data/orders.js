export const orders = [
  {
    id: "ORD-98765",
    orderNumber: "ORD-98765",
    date: "2026-07-15T14:30:00Z",
    status: "Delivered",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Paid",
    address: {
      name: "Sara Johnson",
      phone: "+91 98765 43210",
      line1: "Flat 402, Green Glen Layout",
      line2: "Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    products: [
      { productId: "banana-robusta", quantity: 2 },
      { productId: "amul-taaza-milk", quantity: 3 },
      { productId: "lays-classic", quantity: 1 }
    ],
    subtotal: 220,
    discount: 10,
    shipping: 0,
    tax: 11,
    total: 221,
    estimatedDelivery: "Delivered on Wednesday, July 15",
    trackingStatus: "Delivered",
    notes: "Leave package at the door with security."
  },
  {
    id: "ORD-98766",
    orderNumber: "ORD-98766",
    date: "2026-07-18T09:45:00Z",
    status: "Out For Delivery",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    address: {
      name: "Sara Johnson",
      phone: "+91 98765 43210",
      line1: "Flat 402, Green Glen Layout",
      line2: "Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    products: [
      { productId: "washington-red-apples", quantity: 1 },
      { productId: "dettol-handwash", quantity: 2 }
    ],
    subtotal: 398,
    discount: 0,
    shipping: 0,
    tax: 20,
    total: 418,
    estimatedDelivery: "Arriving in 15-20 minutes",
    trackingStatus: "Out For Delivery",
    notes: "Call when you reach the main gate."
  },
  {
    id: "ORD-98767",
    orderNumber: "ORD-98767",
    date: "2026-07-18T08:15:00Z",
    status: "Packed",
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "Paid",
    address: {
      name: "Sara Johnson",
      phone: "+91 98765 43210",
      line1: "Flat 402, Green Glen Layout",
      line2: "Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    products: [
      { productId: "surf-excel-liquid", quantity: 1 }
    ],
    subtotal: 199,
    discount: 0,
    shipping: 25,
    tax: 10,
    total: 234,
    estimatedDelivery: "Arriving today by 12:30 PM",
    trackingStatus: "Packed",
    notes: ""
  },
  {
    id: "ORD-98768",
    orderNumber: "ORD-98768",
    date: "2026-07-18T10:00:00Z",
    status: "Processing",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    address: {
      name: "Sara Johnson",
      phone: "+91 98765 43210",
      line1: "Flat 402, Green Glen Layout",
      line2: "Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    products: [
      { productId: "instant-coffee-nescafe", quantity: 1 },
      { productId: "curd-mother-dairy", quantity: 2 },
      { productId: "brown-bread", quantity: 1 },
      { productId: "cheese-slices", quantity: 1 }
    ],
    subtotal: 459,
    discount: 10,
    shipping: 0,
    tax: 22,
    total: 471,
    estimatedDelivery: "Arriving today by 1:00 PM",
    trackingStatus: "Confirmed",
    notes: "Ring bell twice."
  },
  {
    id: "ORD-98760",
    orderNumber: "ORD-98760",
    date: "2026-07-12T14:20:00Z",
    status: "Cancelled",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Refunded",
    address: {
      name: "Sara Johnson",
      phone: "+91 98765 43210",
      line1: "Flat 402, Green Glen Layout",
      line2: "Outer Ring Road, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103"
    },
    products: [
      { productId: "table-eggs", quantity: 1 },
      { productId: "coca-cola", quantity: 2 }
    ],
    subtotal: 230,
    discount: 0,
    shipping: 25,
    tax: 12,
    total: 267,
    estimatedDelivery: "Order Cancelled",
    trackingStatus: "Cancelled",
    notes: ""
  }
];

export const getOrderById = (id) => orders.find((order) => order.id === id);
