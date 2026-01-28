function! inkdrop#setup#commands()
  command! InkdropLogin call inkdrop#login()
  command! InkdropNotes call denops#notify('inkdrop', 'router:open', ['notes-list'])
endfunction

function! inkdrop#setup#maps()
  augroup inkdrop-setup-maps
    autocmd!
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <cr>  <plug>(inkdrop-buffer-action-notes-list-open)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-h> <plug>(inkdrop-buffer-action-notes-list-open-new)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-v> <plug>(inkdrop-buffer-action-notes-list-open-vnew)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-t> <plug>(inkdrop-buffer-action-notes-list-open-tabedit)
  augroup END
endfunction
