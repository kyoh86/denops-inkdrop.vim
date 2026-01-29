# denops-inkdrop.vim

Browse Inkdrop notes from Vim/Neovim via denops.vim and Inkdrop Local HTTP Server.

## Requirements

- denops.vim
- Inkdrop with Local HTTP Server enabled

## Setup

```vim
call inkdrop#setup#commands()
```

If you want the default list keymaps (like `<CR>`, `r`, `s` in list buffers), also call:

```vim
call inkdrop#setup#maps()
```

## Usage

- `:InkdropLogin` to set username/password
- `:InkdropLogout` to clear saved credentials
- `:InkdropNotes [keyword]` to open the notes list (optional keyword)
- `:InkdropNew` to create a new note
- `:InkdropNewBook` to create a new notebook
- `:InkdropBooks` to open the notebooks list
- `:InkdropMenu` to open the global menu
- `:InkdropTags` to open the tags list
- `:InkdropRenameBook` to rename the current notebook in the list
- `:InkdropRenameTag` to rename the current tag in the list
- `:InkdropEditTags` to edit tags for the current note
- `:InkdropNoteStatus` to set the current note status
- `:InkdropMoveNote` to change the notebook of the current note
- `:InkdropDeleteNote` to delete the current note
- `:InkdropSearch` to search notes by keyword
- `<CR>` on a note to open it

### <Plug> mappings

The plugin does not define default global keymaps. Use these `<Plug>` mappings
to define your own:

- `<Plug>(inkdrop-login)`
- `<Plug>(inkdrop-logout)`
- `<Plug>(inkdrop-notes)`
- `<Plug>(inkdrop-new)`
- `<Plug>(inkdrop-new-book)`
- `<Plug>(inkdrop-books)`
- `<Plug>(inkdrop-menu)`
- `<Plug>(inkdrop-tags)`
- `<Plug>(inkdrop-edit-tags)`
- `<Plug>(inkdrop-rename-book)`
- `<Plug>(inkdrop-rename-tag)`
- `<Plug>(inkdrop-note-status)`
- `<Plug>(inkdrop-move-note)`
- `<Plug>(inkdrop-delete-note)`
- `<Plug>(inkdrop-search)`

List buffer `<Plug>` mappings are defined in their filetypes and are used by
`inkdrop#setup#maps()`.

Buffer-local `<Plug>` mappings:

- Notes list:
  - `<Plug>(inkdrop-buffer-action-notes-list-open)`
  - `<Plug>(inkdrop-buffer-action-notes-list-open-new)`
  - `<Plug>(inkdrop-buffer-action-notes-list-open-vnew)`
  - `<Plug>(inkdrop-buffer-action-notes-list-open-tabedit)`
  - `<Plug>(inkdrop-buffer-action-notes-list-prev)`
  - `<Plug>(inkdrop-buffer-action-notes-list-next)`
  - `<Plug>(inkdrop-buffer-action-notes-list-refresh)`
  - `<Plug>(inkdrop-buffer-action-notes-list-status)`
- Books list:
  - `<Plug>(inkdrop-buffer-action-books-list-open)`
  - `<Plug>(inkdrop-buffer-action-books-list-open-new)`
  - `<Plug>(inkdrop-buffer-action-books-list-open-vnew)`
  - `<Plug>(inkdrop-buffer-action-books-list-open-tabedit)`
  - `<Plug>(inkdrop-buffer-action-books-list-refresh)`
- Tags list:
  - `<Plug>(inkdrop-buffer-action-tags-list-open)`
  - `<Plug>(inkdrop-buffer-action-tags-list-open-new)`
  - `<Plug>(inkdrop-buffer-action-tags-list-open-vnew)`
  - `<Plug>(inkdrop-buffer-action-tags-list-open-tabedit)`
  - `<Plug>(inkdrop-buffer-action-tags-list-refresh)`
- Menu list:
  - `<Plug>(inkdrop-buffer-action-menu-list-open)`

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
