# Kotama Warehouse - Sistem Manajemen Gudang & Integrasi IoT

**Kotama Warehouse** adalah sebuah sistem informasi manajemen gudang terpadu yang dirancang khusus untuk pabrik sepatu Kotama Shoes. Proyek ini bertujuan untuk mendigitalisasi proses pencatatan stok barang yang sebelumnya manual menjadi sistem otomatis berbasis komputasi awan (*cloud*). Keunikan utama dari sistem ini adalah penggabungan antara aplikasi web (Dashboard Admin) dengan perangkat keras mikrokontroler (*Internet of Things* / IoT) yang diletakkan langsung di area rak penyimpanan fisik pabrik.

Secara garis besar, sistem ini bekerja dengan memusatkan seluruh data di dalam sebuah *database*. Admin mengelola data master melalui *website*, sementara para pengrajin sepatu di lantai produksi menggunakan alat IoT (berbasis ESP32 dan layar LCD) untuk mencatat pengambilan bahan baku. Alat IoT ini terhubung secara langsung melalui jaringan WiFi ke *server* utama, sehingga setiap pengambilan barang oleh pekerja akan langsung memotong persediaan stok di *website* secara *real-time*.

### Fitur dan Keunggulan Sistem

Melalui **Dashboard Web**, admin memiliki kendali penuh untuk mengelola inventaris **Bahan Baku** (seperti tapak, kulit, lapis, dan pelengkap) serta **Barang Jadi** (sepatu yang siap dijual). Sistem ini dibekali indikator warna cerdas yang akan memberitahu admin jika stok suatu barang dalam keadaan aman, mulai menipis, atau sudah habis. Selain itu, admin juga dapat mengelola **Data Pengrajin** secara dinamis. Jika ada pekerja baru yang didaftarkan melalui *website*, nama pekerja tersebut akan langsung muncul di layar alat IoT pada detik itu juga, tanpa perlu membongkar atau memprogram ulang alat fisiknya.

Pada sisi **Alat IoT**, perangkat dirancang untuk bekerja secara mandiri dan pintar. Setiap kali dinyalakan, alat ini secara otomatis mengunduh daftar barang dan nama pekerja terbaru dari *website*. Alat ini kemudian mengurutkannya sesuai abjad dan mengelompokkan barang-barang yang mirip agar pengrajin lebih mudah dan cepat saat memilih barang yang ingin diambil dari layar.

Untuk mencegah terjadinya *error* atau kebocoran data, *website* ini telah dilengkapi dengan **Perlindungan Anti-Spam Klik** (*Double-Submit Protection*). Jika koneksi internet sedang lambat dan pengguna tidak sengaja menekan tombol "Simpan" berkali-kali, sistem akan otomatis mengunci tombol tersebut. Hal ini memastikan tidak ada data yang masuk berulang kali (duplikat) ke dalam sistem.

Seluruh pergerakan barang, baik yang masuk maupun yang diambil oleh pengrajin, akan dicatat secara otomatis dan transparan di halaman **Riwayat Logistik**. Admin dapat memantau siapa yang mengambil barang, apa jenis barangnya, dan kapan barang tersebut diambil. Data riwayat ini juga dapat dengan mudah diunduh ke dalam bentuk laporan **Excel (.xlsx)** untuk keperluan audit bulanan. Selain itu, sistem juga menyediakan tombol **Panduan** terintegrasi yang akan langsung menampilkan *Guide Book* berformat PDF bagi pengguna yang baru pertama kali menggunakan sistem ini.

### Teknologi yang Digunakan
Sistem ini dibangun menggunakan ekosistem teknologi modern agar dapat berjalan cepat dan ringan:
* **Sisi Website (Frontend):** React.js dan Tailwind CSS.
* **Sisi Server (Backend):** Node.js dan Express.js.
* **Penyimpanan Data (Database):** PostgreSQL (Neon.tech).
* **Perangkat Keras (IoT):** Mikrokontroler ESP32 dengan layar TFT LCD.

---
*Dikembangkan oleh Tim IT pembuatan website dari kelompok USU Agile: Johannes Indra Christian Pandiangan.*


  ## Running the code

  Run `npm install` to install the dependencies.

  Run `npm run dev` to start the development server.
  