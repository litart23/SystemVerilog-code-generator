import subprocess
import sys
from langchain.prompts import PromptTemplate

def main():
    # Step 1: Define a prompt template with context and user input
    prompt_template = PromptTemplate(
        input_variables=["user_input"],
        template="Given the following input, generate a SystemVerilog module without any comment:\n\n{user_input}"
    )

    # Step 2: Accept input via command-line arguments
    if len(sys.argv) < 2:
        print("Usage: python generate_sv.py '<user_input>'")
        sys.exit(1)

    user_input = sys.argv[1]

    # Generate the prompt
    prompt = prompt_template.format(user_input=user_input)

    # Step 3: Call the command "ollama run codellama" with the user input
    try:
        # Using subprocess to call the command with the generated prompt
        result = subprocess.run(
            ["ollama", "run", "codellama"],
            input=prompt,
            text=True,
            capture_output=True,
            check=True
        )

        # Step 4: Return and print the generated SystemVerilog code
        print("//Generated SystemVerilog Code:\n")
        print(result.stdout)

    except subprocess.CalledProcessError as e:
        print(f"Error occurred while generating code: {e.stderr}")

if __name__ == "__main__":
    main()