{
  description = "Chef - An AI Agent development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Node.js version from .nvmrc
        nodejs = pkgs.nodejs_20;
        
        # pnpm package manager
        pnpm = pkgs.pnpm;
        
        # Development shell with all necessary tools
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core Node.js ecosystem
            nodejs
            pnpm
            
            # Build and development tools
            typescript
            nodePackages.typescript-language-server
            
            # Additional utilities
            git
            curl
            openssl
            pkg-config
            
            # For native dependencies
            python3
            gnumake
            gcc
            libffi
            cairo
            pango
            gdk-pixbuf
            librsvg
            libjpeg
            libpng
            libwebp
            sqlite
          ];
          
          # Environment variables
          shellHook = ''
            # Ensure pnpm is available
            export PATH="${pnpm}/bin:$PATH"
            
            # Development server port (from DEVELOPMENT.md)
            export PORT=5173
            export HOST=127.0.0.1
            
            echo "🍳 Chef Development Environment Ready!"
            echo "Node.js: $(node --version)"
            echo "pnpm: $(pnpm --version)"
            echo ""
            echo "Quick start:"
            echo "  pnpm i                    # Install dependencies"
            echo "  pnpm run dev              # Start development server"
            echo "  npx convex dev            # Start Convex backend (in another terminal)"
            echo ""
            echo "Visit: http://127.0.0.1:5173"
            echo ""
            echo "Workspace packages:"
            echo "  - chef-agent: AI agent logic"
            echo "  - chefshot: Browser automation"
            echo "  - test-kitchen: Testing framework"
            echo "  - template: SvelteKit template"
          '';
        };
        
      in {
        # Development shell
        devShells.default = devShell;
      });
}