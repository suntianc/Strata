#!/bin/bash

# Strata OS LLM Setup Script
# This script helps you configure LLM provider for Strata OS

echo "======================================"
echo "  Strata OS - LLM Configuration"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "Choose your LLM provider:"
echo "1) Gemini (Cloud, recommended)"
echo "2) Ollama (Local, private)"
echo ""
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "=== Gemini Configuration ==="
    echo "Get your API key from: https://aistudio.google.com/app/apikey"
    echo ""
    read -p "Enter your Gemini API key: " api_key

    if [ -z "$api_key" ]; then
        echo "❌ API key cannot be empty"
        exit 1
    fi

    # Update .env file
    if grep -q "^GEMINI_API_KEY=" .env; then
        sed -i "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=$api_key/" .env
    else
        echo "GEMINI_API_KEY=$api_key" >> .env
    fi

    echo "✅ Gemini API key configured!"
    echo ""
    echo "You can now start the app with: npm run dev:electron"

elif [ "$choice" == "2" ]; then
    echo ""
    echo "=== Ollama Configuration ==="

    # Check if ollama is installed
    if ! command -v ollama &> /dev/null; then
        echo "Ollama is not installed. Installing now..."
        curl -fsSL https://ollama.ai/install.sh | sh
        echo "✅ Ollama installed"
    else
        echo "✅ Ollama is already installed"
    fi

    # Check if ollama is running
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo ""
        echo "Starting Ollama service..."
        ollama serve &
        sleep 2
        echo "✅ Ollama service started"
    else
        echo "✅ Ollama service is running"
    fi

    # Check and pull models
    echo ""
    echo "Checking models..."

    if ! ollama list | grep -q "llama3.2"; then
        echo "Downloading llama3.2 model (this may take a few minutes)..."
        ollama pull llama3.2
        echo "✅ llama3.2 downloaded"
    else
        echo "✅ llama3.2 is already downloaded"
    fi

    if ! ollama list | grep -q "nomic-embed-text"; then
        echo "Downloading nomic-embed-text model..."
        ollama pull nomic-embed-text
        echo "✅ nomic-embed-text downloaded"
    else
        echo "✅ nomic-embed-text is already downloaded"
    fi

    # Comment out Gemini API key in .env
    if grep -q "^GEMINI_API_KEY=" .env; then
        sed -i "s/^GEMINI_API_KEY=/#GEMINI_API_KEY=/" .env
        echo "✅ Configured to use Ollama (Gemini API key commented out)"
    fi

    echo ""
    echo "✅ Ollama configured successfully!"
    echo ""
    echo "You can now start the app with: npm run dev:electron"
    echo ""
    echo "Note: Keep Ollama service running in the background"

else
    echo "❌ Invalid choice. Please run the script again."
    exit 1
fi

echo ""
echo "======================================"
echo "  Configuration Complete! 🎉"
echo "======================================"
