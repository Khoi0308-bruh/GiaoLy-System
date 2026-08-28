import fs from 'fs';
import path from 'path';

const rootDir = 'c:/GiaoLy';
const outputFile = path.join(rootDir, 'full_project_source_code.html');

const ignoreDirs = ['node_modules', 'bin', 'obj', '.nuxt', '.output', '.git', '.github', 'dist', 'public', 'assets', '.vs'];
const ignoreFiles = ['package-lock.json', 'pnpm-lock.yaml', 'full_project_source_code.html', 'project_analysis.html', 'client_analysis.html', 'mock-students-real.xlsx', 'mock-students.xls', 'mock-students.xlsx', 'GiaoLySystem.slnx'];
const validExtensions = ['.cs', '.ts', '.js', '.vue', '.json', '.html', '.css', '.md', '.csproj', '.mjs', '.yaml', '.xml'];

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (!ignoreFiles.includes(name) && validExtensions.includes(path.extname(name))) {
                callback(filePath, stat);
            }
        } else if (stat.isDirectory()) {
            if (!ignoreDirs.includes(name)) {
                walkSync(filePath, callback);
            }
        }
    });
}

let htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GiaoLy Project - Full Source Code Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        body { font-family: 'Inter', sans-serif; }
        pre { max-height: 500px; overflow-y: auto; }
        .toc { max-height: 400px; overflow-y: auto; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800">
    <div class="container mx-auto py-10 px-4">
        <header class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-blue-700 mb-4">Báo Cáo Chi Tiết Dự Án GiaoLy & Toàn Bộ Source Code</h1>
            <p class="text-lg text-gray-600">Báo cáo tình trạng dự án và tổng hợp toàn bộ mã nguồn</p>
        </header>

        <section class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">1. Tổng Quan Tiến Độ & Tình Trạng Dự Án</h2>
            <div class="space-y-4 text-gray-700">
                <p>Dự án <strong>GiaoLy</strong> là một hệ thống quản lý mục vụ giáo xứ và thiếu nhi Thánh Thể, được chia làm 2 phần chính: Backend (C# .NET) và Frontend (Nuxt 3 / Vue 3).</p>
                <h3 class="text-xl font-semibold mt-6">1.1. Phần Backend (.NET 10 API)</h3>
                <ul class="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Kiến trúc:</strong> Clean Architecture (Domain, Application, API).</li>
                    <li><strong>Database:</strong> Entity Framework Core, SQL Server.</li>
                    <li><strong>Features đã triển khai:</strong> Quản lý User (Auth/JWT), Quản lý Học sinh (Students), Điểm số (Grades), Lớp học (ClassRooms), Năm học (AcademicYears), Sơ đồ tổ chức (Leaders), Chứng từ số (Certificates), và Đọc/Ghi Excel (ClosedXML).</li>
                    <li><strong>Tình trạng:</strong> Đã cấu trúc tốt, có các Repository, Services, và Controllers đầy đủ cho các nghiệp vụ chính.</li>
                </ul>
                <h3 class="text-xl font-semibold mt-6">1.2. Phần Frontend (Nuxt 3)</h3>
                <ul class="list-disc list-inside ml-4 space-y-1">
                    <li><strong>Công nghệ:</strong> Nuxt 3, Vue 3, TailwindCSS, Nuxt UI.</li>
                    <li><strong>Cấu trúc thư mục:</strong> Pages, Components, Composables, Stores (Pinia), Locales (i18n), Layouts.</li>
                    <li><strong>Features đã triển khai:</strong> UI/UX hiện đại (Sáng/Tối mode), quản lý đa ngôn ngữ (i18n), tích hợp API từ Backend, trang quản trị (Admin Dashboard), danh sách học sinh, điểm số, sơ đồ tổ chức Ban điều hành.</li>
                    <li><strong>Tình trạng:</strong> Đã có khung giao diện hoàn chỉnh, hệ thống routing, và liên kết dữ liệu mẫu.</li>
                </ul>
                <h3 class="text-xl font-semibold mt-6">1.3. Kết Luận</h3>
                <p>Dự án đã đạt được một bộ khung rất vững chắc từ Backend đến Frontend. Các tính năng cốt lõi đã được xây dựng. Mã nguồn được tổ chức sạch sẽ, tuân thủ Clean Architecture ở Backend và chuẩn module của Nuxt ở Frontend.</p>
            </div>
        </section>

        <section class="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">2. Mục Lục Source Code</h2>
            <div class="toc bg-gray-100 p-4 rounded-lg">
                <ul class="list-none space-y-1">
`;

const filesToProcess = [];

walkSync(rootDir, (filePath) => {
    // Only include GiaoLy.* and web-app folders, plus root files like project_specification.md
    if (filePath.includes('GiaoLy.API') || filePath.includes('GiaoLy.Application') || filePath.includes('GiaoLy.Domain') || filePath.includes('web-app') || filePath === path.join(rootDir, 'project_specification.md')) {
        filesToProcess.push(filePath);
    }
});

filesToProcess.sort();

filesToProcess.forEach((filePath, index) => {
    const relativePath = path.relative(rootDir, filePath).replace(/\\\\/g, '/');
    htmlContent += '<li><a href="#file-' + index + '" class="text-blue-600 hover:underline">' + relativePath + '</a></li>\n';
});

htmlContent += `
                </ul>
            </div>
        </section>

        <section>
            <h2 class="text-2xl font-bold text-gray-800 mb-6">3. Chi Tiết Source Code</h2>
`;

filesToProcess.forEach((filePath, index) => {
    const relativePath = path.relative(rootDir, filePath).replace(/\\\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Escape HTML
    const escapedContent = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    let languageClass = 'language-markup';
    if (filePath.endsWith('.cs')) languageClass = 'language-csharp';
    else if (filePath.endsWith('.ts')) languageClass = 'language-typescript';
    else if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) languageClass = 'language-javascript';
    else if (filePath.endsWith('.json')) languageClass = 'language-json';
    else if (filePath.endsWith('.vue')) languageClass = 'language-markup'; // Prism uses markup for vue/html
    else if (filePath.endsWith('.css')) languageClass = 'language-css';
    else if (filePath.endsWith('.md')) languageClass = 'language-markdown';
    else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) languageClass = 'language-yaml';

    htmlContent += `
            <div id="file-` + index + `" class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="font-bold text-gray-700">` + relativePath + `</h3>
                    <a href="#top" class="text-sm text-blue-500 hover:underline">Về mục lục</a>
                </div>
                <div class="p-0">
                    <pre><code class="` + languageClass + `">` + escapedContent + `</code></pre>
                </div>
            </div>
`;
});

htmlContent += `
        </section>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-csharp.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markdown.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-yaml.min.js"></script>
</body>
</html>
`;

fs.writeFileSync(outputFile, htmlContent, 'utf-8');
console.log('Successfully generated ' + outputFile);
