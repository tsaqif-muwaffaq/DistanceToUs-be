import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Memuat variabel lingkungan dari file .env
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware biar bisa baca JSON dari body request
// `express.json()` adalah middleware bawaan Express yang mem-parsing incoming request bodies dengan payload JSON.
// Ini memungkinkan kita untuk mengakses data yang dikirim dalam format JSON melalui `req.body`.
app.use(express.json());
// Data sementara (in-memory) – nanti diganti database
// Perlu diingat bahwa data in-memory ini akan hilang setiap kali server di-restart.
// Untuk aplikasi produksi, kita akan menggunakan database sungguhan.
let products = [
    {
        id: 1,
        nama: "Laptop Gaming",
        deskripsi: "Intel i7, RTX 3060",
        harga: 15000000,
    },
    {
        id: 2,
        nama: "Keyboard Mekanikal",
        deskripsi: "Blue Switch, RGB",
        harga: 800000,
    },
    {
        id: 3,
        nama: "Mouse Wireless",
        deskripsi: "Ergonomic, Silent Click",
        harga: 300000,
    },
];
// Catatan TypeScript: `req: Request` dan `res: Response` adalah Type Annotations.
// Ini memberi tahu TypeScript bahwa `req` adalah objek `Request` dari Express dan `res` adalah objek `Response`.
// Ini sangat membantu untuk mendapatkan *autocomplete* dan *type checking* selama pengembangan.
// Catatan Konversi Tipe Data:
// `parseInt(req.params.id)` digunakan untuk mengkonversi string ID dari URL menjadi integer.
// `Number(harga_max)` atau `Number(harga)` digunakan untuk mengkonversi string harga menjadi angka.
// Ini penting karena data yang diterima dari request (params, query, body) awalnya bertipe string.
// 1. ROUTE GET – Home
app.get("/", (_req, res) => {
    res.json({
        message: "Selamat datang di API E-Commerce!",
        hari: 3, // Mengubah menjadi hari 3
        status: "Server hidup!",
    });
});
// Catatan: HTTP Status Code (misalnya 200 OK, 201 Created, 404 Not Found) sangat penting
// untuk memberitahu klien hasil dari permintaan mereka. Kita akan menggunakannya secara konsisten.
// 2. ROUTE GET – Tampilkan semua produk
app.get("/api/products", (_req, res) => {
    res.json({
        success: true,
        jumlah: products.length,
        data: products,
    });
});
// 3. ROUTE GET – Cari berdasarkan ID (Route Params)
app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const product = products.find((p) => p.id === id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Produk tidak ditemukan",
        });
    }
    res.json({
        success: true,
        data: product,
    });
});
// Perbandingan Route Params vs Query String:
// - Route Params (`/api/products/:id`): Digunakan untuk mengidentifikasi sumber daya tertentu dalam koleksi.
//   Contoh: ID produk, ID pengguna. Bagian dari URL path.
// - Query String (`/api/search?name=...`): Digunakan untuk filter, sorting, atau pagination
//   pada koleksi sumber daya. Muncul setelah `?` di URL.
// 4. ROUTE GET – Filter dengan Query String
app.get("/api/search", (req, res) => {
    const { name, max_price } = req.query;
    let result = products;
    if (name) {
        result = result.filter((p) => p.nama.toLowerCase().includes(name.toLowerCase()));
    }
    if (max_price) {
        result = result.filter((p) => p.harga <= Number(max_price));
    }
    res.json({
        success: true,
        filtered_result: result,
    });
});
// 5. ROUTE POST – Tambah produk baru
app.post("/api/products", (req, res) => {
    const { nama, deskripsi, harga } = req.body;
    const newProduct = {
        id: products.length + 1,
        nama,
        deskripsi,
        harga: Number(harga),
    };
    products.push(newProduct);
    res.status(201).json({
        success: true,
        message: "Produk berhasil ditambahkan",
        data: newProduct,
    });
});
// 6. ROUTE PUT – Update produk
app.put("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        return res
            .status(404)
            .json({ success: false, message: "Produk tidak ada" });
    }
    // Penggunaan Spread Operator (`...`):
    // `...products[index]` akan menyalin semua properti dari objek produk yang sudah ada.
    // `...req.body` akan menyalin semua properti dari data yang dikirimkan di body request.
    // Jika ada properti yang sama, properti dari `req.body` akan menimpa properti dari `products[index]`.
    // Ini memungkinkan kita untuk melakukan partial update (hanya mengubah properti yang dikirim).
    products[index] = { ...products[index], ...req.body };
    res.json({
        success: true,
        message: "Produk berhasil diupdate",
        data: products[index],
    });
});
// 7. ROUTE DELETE – Hapus produk
app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        return res
            .status(404)
            .json({ success: false, message: "Produk tidak ada" });
    }
    const deleted = products.splice(index, 1);
    res.json({
        success: true,
        message: "Produk berhasil dihapus",
        data: deleted[0],
    });
});
app.listen(PORT, () => {
    console.log(`Server jalan → http://localhost:${PORT}`);
    console.log(`Coba buka semua route di atas pakai Postman!`);
});
//# sourceMappingURL=index.js.map