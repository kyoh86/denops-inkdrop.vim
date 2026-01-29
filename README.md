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
- `:InkdropLogout` to clear saved credentials
- `:InkdropNotes [keyword]` to open the notes list (optional keyword)
- `:InkdropNew` to create a new note
- `:InkdropBooks` to open the notebooks list
- `:InkdropSearch` to search notes by keyword
- `<CR>` on a note to open it

### Base URL

By default, the plugin connects to `http://127.0.0.1:19840`.
You can override it via `g:inkdrop_base_url`:

```vim
let g:inkdrop_base_url = 'http://localhost:19840'
```

### Notes list defaults

```vim
let g:inkdrop_notes_limit = 100
let g:inkdrop_notes_sort = 'updatedAt' " or 'createdAt' / 'title'
let g:inkdrop_notes_descending = 1
```

### Note creation

If you want to choose a specific notebook, set:

```vim
let g:inkdrop_default_book_id = 'your-book-id'
```

## License

MIT
