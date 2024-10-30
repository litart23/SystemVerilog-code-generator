// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { spawn } from 'child_process';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Register the command in VS Code
    let disposable = vscode.commands.registerCommand('extension.generateFromComment', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        // Get the selected text, which should be the comment
        const selectedText = editor.document.getText(editor.selection);

        // Check if the selection is a comment
        if (!selectedText.trim().startsWith("//")) {
            vscode.window.showErrorMessage('Please select a comment to generate code from.');
            return;
        }

        // Run the Python script with the comment as input using spawn
        const command = 'python';
        const args = ['E:/master/langchain/prj/main.py', selectedText];
        const pythonProcess = spawn(command, args);

        // Capture real-time output from Python script
        let output = ''; // Accumulates the output received so far

        pythonProcess.stdout.on('data', (data) => {
            // Convert buffer data to a string
            const chunk = data.toString();
            output += chunk;

            // Insert each chunk of data into the editor in real-time
            editor.edit(editBuilder => {
                const position = editor.selection.end;
                editBuilder.insert(position, chunk);
            });
        });

        pythonProcess.stderr.on('data', (data) => {
            // Show errors if any
            vscode.window.showErrorMessage(`Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                vscode.window.showErrorMessage(`Python script exited with code ${code}`);
            }
        });
    });

    context.subscriptions.push(disposable);
}