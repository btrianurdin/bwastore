import { diskStorage } from "multer";
import { join, extname } from "path";

const multerStorage = diskStorage({
  destination: function(req, file, cb) {
    cb(null, join(__dirname, "../../public/uploads"));
  },
  filename: function(req, file, cb) {
    const newFileName = `${file.originalname.split(".")[0]}-${Date.now() + extname(file.originalname)}`
    cb(null, newFileName);
  }
});

export default multerStorage;
