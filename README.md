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

- `:InkdropLogin` to set username/password
- `:InkdropNotes` to open the notes list
- `<CR>` on a note to open it

### Base URL

By default, the plugin connects to `http://127.0.0.1:19840`.
You can override it via `g:inkdrop_base_url`:

```vim
let g:inkdrop_base_url = 'http://localhost:19840'
```

## License

MIT
