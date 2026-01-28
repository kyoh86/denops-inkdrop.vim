# denops-inkdrop.vim

Browse Inkdrop notes from Vim/Neovim via denops.vim and Inkdrop Local HTTP Server.

## Requirements

- denops.vim
- Inkdrop with Local HTTP Server enabled

## Setup

```vim
call inkdrop#setup#commands()
call inkdrop#setup#maps()
```

## Usage

- `:InkdropLogin` to set username/password and base URL
- `:InkdropNotes` to open the notes list
- `<CR>` on a note to open it

## License

MIT
