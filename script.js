// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentFile = null;

// 拖拽上传相关事件
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// 文件选择事件
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// 质量滑块变化事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (currentFile) {
        compressImage(currentFile, e.target.value / 100);
    }
});

// 处理上传的文件
function handleFile(file) {
    // 检查文件类型
    if (!file.type.match(/image\/(jpeg|png)/i)) {
        alert('请上传 JPG 或 PNG 格式的图片！');
        return;
    }

    currentFile = file;
    
    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 预览原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        // 压缩图片
        compressImage(file, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);

    // 显示预览区域
    previewSection.classList.remove('hidden');
}

// 压缩图片
function compressImage(file, quality) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 创建 Canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图片
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // 压缩并预览
            canvas.toBlob((blob) => {
                const compressedUrl = URL.createObjectURL(blob);
                compressedPreview.src = compressedUrl;
                compressedSize.textContent = formatFileSize(blob.size);
                
                // 更新下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = compressedUrl;
                    link.download = `compressed_${file.name}`;
                    link.click();
                };
            }, file.type, quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 添加拖拽效果的样式
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .upload-area.dragover {
            border-color: var(--primary-color);
            background-color: rgba(0, 122, 255, 0.05);
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
});
