import File from '../models/fileSchema.js';  
import userModel from '../models/user.js';

const uploadAvatar = async (req, res) => {
  const userId = req.user.id;
  console.log('User ID:', userId);
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Delete previous avatar file if it exists
    if (user.photo && fs.existsSync(user.photo)) {
      fs.unlinkSync(user.photo);
    }

    // Save file path in user profile
    const relativePath = req.file.path.split('uploads')[1];
    user.photo = `/uploads${relativePath}`;
    await user.save();

    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
    });

    await file.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        originalName: file.originalName,
        filename: file.filename,
        useravatar: user.photo,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { uploadAvatar };
