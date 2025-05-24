const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// نقطة نهاية اختبارية
app.get('/api/test', (req, res) => {
  res.json({ message: 'الباكند يعمل بشكل صحيح!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 