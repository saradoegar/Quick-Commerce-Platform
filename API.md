# Orders, Payments, and Reviews API

Set the values in `server/.env.example` in an untracked `server/.env`. All protected routes require `Authorization: Bearer <JWT>`; its payload must contain `id` (or `_id`/`userId`). Admin-only routes require `role: "admin"`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/orders` | Create an order with `items`, `shippingAddress`, `pricing`, and `paymentMethod` (`cod` or `razorpay`) |
| GET | `/api/orders/my` | Current user's order history |
| GET | `/api/orders/:id` | An order owned by current user; admins may read any |
| GET | `/api/orders?status=&page=&limit=` | All orders (admin) |
| PATCH | `/api/orders/:id/status` | Change order status (admin) |
| POST | `/api/orders/:id/cancel` | Cancel own unshipped order |
| POST | `/api/payments/razorpay/order` | Create a Razorpay order for `{ "orderId" }` |
| POST | `/api/payments/razorpay/verify` | Verify Razorpay signature and mark payment paid |
| POST | `/api/payments/razorpay/failure` | Record a failed/cancelled gateway checkout |
| GET | `/api/products/:productId/reviews` | List reviews and rating aggregate |
| POST | `/api/products/:productId/reviews` | Add authenticated user's review `{ rating, comment }` |
| PATCH | `/api/reviews/:id` | Update own review |
| DELETE | `/api/reviews/:id` | Delete own review |

Amounts use rupees in MongoDB; Razorpay receives paise, calculated from the stored server order total. Never send `RAZORPAY_KEY_SECRET` to the browser.
