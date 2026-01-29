if exists("g:loaded_inkdrop")
  finish
endif
let g:loaded_inkdrop = 1

nnoremap <silent> <Plug>(inkdrop-login) <cmd>InkdropLogin<cr>
nnoremap <silent> <Plug>(inkdrop-logout) <cmd>InkdropLogout<cr>
nnoremap <silent> <Plug>(inkdrop-notes) <cmd>InkdropNotes<cr>
nnoremap <silent> <Plug>(inkdrop-new) <cmd>InkdropNew<cr>
nnoremap <silent> <Plug>(inkdrop-new-book) <cmd>InkdropNewBook<cr>
nnoremap <silent> <Plug>(inkdrop-books) <cmd>InkdropBooks<cr>
nnoremap <silent> <Plug>(inkdrop-menu) <cmd>InkdropMenu<cr>
nnoremap <silent> <Plug>(inkdrop-tags) <cmd>InkdropTags<cr>
nnoremap <silent> <Plug>(inkdrop-edit-tags) <cmd>InkdropEditTags<cr>
nnoremap <silent> <Plug>(inkdrop-rename-book) <cmd>InkdropRenameBook<cr>
nnoremap <silent> <Plug>(inkdrop-rename-tag) <cmd>InkdropRenameTag<cr>
nnoremap <silent> <Plug>(inkdrop-note-status) <cmd>InkdropNoteStatus<cr>
nnoremap <silent> <Plug>(inkdrop-move-note) <cmd>InkdropMoveNote<cr>
nnoremap <silent> <Plug>(inkdrop-delete-note) <cmd>InkdropDeleteNote<cr>
nnoremap <silent> <Plug>(inkdrop-search) <cmd>InkdropSearch<cr>
