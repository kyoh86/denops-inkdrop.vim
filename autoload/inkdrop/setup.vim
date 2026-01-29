function! inkdrop#setup#commands()
  command! InkdropLogin call inkdrop#login()
  command! InkdropLogout call inkdrop#logout()
  command! -nargs=? InkdropNotes call inkdrop#notes(<q-args>)
  command! InkdropNew call inkdrop#new()
  command! InkdropBooks call inkdrop#books()
  command! InkdropTags call inkdrop#tags()
  command! InkdropTagEdit call inkdrop#tag_edit()
  command! InkdropSearch call denops#notify('inkdrop', 'search', [])
endfunction

function! inkdrop#setup#maps()
  augroup inkdrop-setup-maps
    autocmd!
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <cr>  <plug>(inkdrop-buffer-action-notes-list-open)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-h> <plug>(inkdrop-buffer-action-notes-list-open-new)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-v> <plug>(inkdrop-buffer-action-notes-list-open-vnew)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-t> <plug>(inkdrop-buffer-action-notes-list-open-tabedit)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-k> <plug>(inkdrop-buffer-action-notes-list-prev)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-j> <plug>(inkdrop-buffer-action-notes-list-next)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> r     <plug>(inkdrop-buffer-action-notes-list-refresh)
    autocmd Filetype inkdrop_books_list nnoremap <buffer> <cr>  <plug>(inkdrop-buffer-action-books-list-open)
    autocmd Filetype inkdrop_books_list nnoremap <buffer> <c-h> <plug>(inkdrop-buffer-action-books-list-open-new)
    autocmd Filetype inkdrop_books_list nnoremap <buffer> <c-v> <plug>(inkdrop-buffer-action-books-list-open-vnew)
    autocmd Filetype inkdrop_books_list nnoremap <buffer> <c-t> <plug>(inkdrop-buffer-action-books-list-open-tabedit)
    autocmd Filetype inkdrop_tags_list nnoremap <buffer> <cr>  <plug>(inkdrop-buffer-action-tags-list-open)
    autocmd Filetype inkdrop_tags_list nnoremap <buffer> <c-h> <plug>(inkdrop-buffer-action-tags-list-open-new)
    autocmd Filetype inkdrop_tags_list nnoremap <buffer> <c-v> <plug>(inkdrop-buffer-action-tags-list-open-vnew)
    autocmd Filetype inkdrop_tags_list nnoremap <buffer> <c-t> <plug>(inkdrop-buffer-action-tags-list-open-tabedit)
  augroup END
endfunction
