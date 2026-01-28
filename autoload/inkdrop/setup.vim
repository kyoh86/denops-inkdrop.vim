function! inkdrop#setup#commands()
  call denops#request('inkdrop', 'router:setup:command', ['notes-list'])
  call denops#request('inkdrop', 'router:setup:command', ['notes-list', 'InkdropNotes'])
  call denops#request('inkdrop', 'router:setup:command', ['note'])
  command! InkdropLogin call inkdrop#login()
endfunction

function! inkdrop#setup#maps()
  if get(g:, 'inkdrop_disable_default_mappings', 0)
    return
  endif
  augroup inkdrop-setup-maps
    autocmd!
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <cr>  <plug>(inkdrop-buffer-action-notes-list-open)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-h> <plug>(inkdrop-buffer-action-notes-list-open-new)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-v> <plug>(inkdrop-buffer-action-notes-list-open-vnew)
    autocmd Filetype inkdrop_notes_list nnoremap <buffer> <c-t> <plug>(inkdrop-buffer-action-notes-list-open-tabedit)
  augroup END
endfunction
