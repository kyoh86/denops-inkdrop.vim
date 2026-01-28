if exists('b:did_ftplugin')
  finish
endif
let b:did_ftplugin = 1

nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open) <cmd>call inkdrop#buffer_action#notes_list#open(line("."))<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-new) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-above"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-vnew) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-tabedit) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-tab"})<cr>
