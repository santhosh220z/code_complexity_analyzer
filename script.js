// Complexity analysis functions
function calculateCyclomaticComplexity(code, language) {
    // Simplified cyclomatic complexity calculation
    let complexity = 1; // Base complexity

    // Count control flow keywords
    const controlFlowKeywords = {
        python: ['if', 'elif', 'for', 'while', 'try', 'except', 'with'],
        javascript: ['if', 'else if', 'for', 'while', 'do', 'switch', 'case', 'try', 'catch'],
        cpp: ['if', 'else if', 'for', 'while', 'do', 'switch', 'case', 'try', 'catch'],
        csharp: ['if', 'else if', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'try', 'catch', 'when'],
        c: ['if', 'else if', 'for', 'while', 'do', 'switch', 'case'],
        go: ['if', 'else if', 'for', 'switch', 'case', 'select', 'default'],
        lua: ['if', 'elseif', 'for', 'while', 'repeat', 'until'],
        php: ['if', 'elseif', 'else if', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'try', 'catch'],
        ruby: ['if', 'elsif', 'unless', 'for', 'while', 'until', 'case', 'when', 'begin', 'rescue'],
        java: ['if', 'else if', 'for', 'while', 'do', 'switch', 'case', 'try', 'catch'],
        swift: ['if', 'else if', 'for', 'while', 'repeat', 'switch', 'case', 'do', 'catch'],
        kotlin: ['if', 'else if', 'for', 'while', 'do', 'when', 'try', 'catch']
    };

    const keywords = controlFlowKeywords[language] || [];
    const lines = code.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        for (const keyword of keywords) {
            if (trimmedLine.startsWith(keyword + ' ') || trimmedLine.includes(' ' + keyword + ' ')) {
                complexity++;
                break;
            }
        }
    }

    return complexity;
}

function calculateNestingDepth(code, language) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    const indentChars = language === 'python' ? '    ' : language === 'cpp' ? '{' : '{';
    const lines = code.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (language === 'python') {
            const indentLevel = line.length - line.trimStart().length;
            currentDepth = Math.floor(indentLevel / 4);
        } else {
            if (trimmedLine.includes('{')) currentDepth++;
            if (trimmedLine.includes('}')) currentDepth--;
        }
        maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    return maxDepth;
}

function calculateModularityScore(code, language) {
    // Simplified modularity score based on function/method definitions
    const functionKeywords = {
        python: ['def '],
        javascript: ['function ', 'const ', 'let ', 'var '],
        cpp: ['void ', 'int ', 'float ', 'double ', 'char ', 'bool ']
    };
    
    const keywords = functionKeywords[language] || [];
    let functionCount = 0;
    const lines = code.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        for (const keyword of keywords) {
            if (trimmedLine.startsWith(keyword)) {
                functionCount++;
                break;
            }
        }
    }
    
    // Modularity score: higher is better (more functions relative to code size)
    const totalLines = lines.length;
    return totalLines > 0 ? (functionCount / totalLines * 100).toFixed(2) : 0;
}

function calculateLineStatistics(code) {
    const lines = code.split('\n');
    let totalLines = lines.length;
    let codeLines = 0;
    let commentLines = 0;
    let emptyLines = 0;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
            emptyLines++;
        } else if (trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('/*')) {
            commentLines++;
        } else {
            codeLines++;
        }
    }
    
    return {
        totalLines,
        codeLines,
        commentLines,
        emptyLines
    };
}

function analyzeCode(code, language) {
    const cyclomaticComplexity = calculateCyclomaticComplexity(code, language);
    const nestingDepth = calculateNestingDepth(code, language);
    const modularityScore = calculateModularityScore(code, language);
    const lineStats = calculateLineStatistics(code);
    
    return {
        cyclomaticComplexity,
        nestingDepth,
        modularityScore: parseFloat(modularityScore),
        lineStatistics: lineStats
    };
}

// UI functions
function displayResults(results, format) {
    const resultsDisplay = document.getElementById('results-display');
    
    if (format === 'json') {
        resultsDisplay.textContent = JSON.stringify(results, null, 2);
    } else {
        let output = 'Code Complexity Analysis Results:\n\n';
        output += `Cyclomatic Complexity: ${results.cyclomaticComplexity}\n`;
        output += `Nesting Depth: ${results.nestingDepth}\n`;
        output += `Modularity Score: ${results.modularityScore}%\n\n`;
        output += 'Line Statistics:\n';
        output += `Total Lines: ${results.lineStatistics.totalLines}\n`;
        output += `Code Lines: ${results.lineStatistics.codeLines}\n`;
        output += `Comment Lines: ${results.lineStatistics.commentLines}\n`;
        output += `Empty Lines: ${results.lineStatistics.emptyLines}\n`;
        
        resultsDisplay.textContent = output;
    }
}

function exportAsMarkdown(results) {
    let markdown = '# Code Complexity Analysis Report\n\n';
    markdown += `## Cyclomatic Complexity\n${results.cyclomaticComplexity}\n\n`;
    markdown += `## Nesting Depth\n${results.nestingDepth}\n\n`;
    markdown += `## Modularity Score\n${results.modularityScore}%\n\n`;
    markdown += '## Line Statistics\n';
    markdown += `- Total Lines: ${results.lineStatistics.totalLines}\n`;
    markdown += `- Code Lines: ${results.lineStatistics.codeLines}\n`;
    markdown += `- Comment Lines: ${results.lineStatistics.commentLines}\n`;
    markdown += `- Empty Lines: ${results.lineStatistics.emptyLines}\n`;
    
    downloadFile('complexity_report.md', markdown);
}

function exportAsCSV(results) {
    let csv = 'Metric,Value\n';
    csv += `Cyclomatic Complexity,${results.cyclomaticComplexity}\n`;
    csv += `Nesting Depth,${results.nestingDepth}\n`;
    csv += `Modularity Score,${results.modularityScore}\n`;
    csv += `Total Lines,${results.lineStatistics.totalLines}\n`;
    csv += `Code Lines,${results.lineStatistics.codeLines}\n`;
    csv += `Comment Lines,${results.lineStatistics.commentLines}\n`;
    csv += `Empty Lines,${results.lineStatistics.emptyLines}\n`;
    
    downloadFile('complexity_report.csv', csv);
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const fileInput = document.getElementById('file-input');
    const codeInput = document.getElementById('code-input');
    const humanReadableBtn = document.getElementById('human-readable-btn');
    const jsonBtn = document.getElementById('json-btn');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const outputSection = document.getElementById('output-section');
    
    let currentResults = null;
    let currentFormat = 'human';
    
    analyzeBtn.addEventListener('click', function() {
        const language = document.getElementById('language-select').value;
        let code = codeInput.value;
        
        if (!code && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                code = e.target.result;
                performAnalysis(code, language);
            };
            reader.readAsText(file);
        } else if (code) {
            performAnalysis(code, language);
        } else {
            alert('Please paste code or upload a file.');
        }
    });
    
    function performAnalysis(code, language) {
        currentResults = analyzeCode(code, language);
        displayResults(currentResults, currentFormat);
        outputSection.style.display = 'block';
    }
    
    humanReadableBtn.addEventListener('click', function() {
        currentFormat = 'human';
        humanReadableBtn.classList.add('active');
        jsonBtn.classList.remove('active');
        if (currentResults) displayResults(currentResults, currentFormat);
    });
    
    jsonBtn.addEventListener('click', function() {
        currentFormat = 'json';
        jsonBtn.classList.add('active');
        humanReadableBtn.classList.remove('active');
        if (currentResults) displayResults(currentResults, currentFormat);
    });
    
    exportMdBtn.addEventListener('click', function() {
        if (currentResults) exportAsMarkdown(currentResults);
    });
    
    exportCsvBtn.addEventListener('click', function() {
        if (currentResults) exportAsCSV(currentResults);
    });
});
