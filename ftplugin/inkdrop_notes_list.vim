nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open) <cmd>call inkdrop#buffer_action#notes_list#open(line("."))<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-new) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-above"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-vnew) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-vnew-left) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-vnew-right) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-right"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-open-tabedit) <cmd>call inkdrop#buffer_action#notes_list#open(line("."), {"split": "split-tab"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-prev) <cmd>call inkdrop#buffer_action#notes_list#prev()<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-next) <cmd>call inkdrop#buffer_action#notes_list#next()<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-refresh) <cmd>call inkdrop#buffer_action#notes_list#refresh()<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-notes-list-status) <cmd>call inkdrop#buffer_action#notes_list#status(line("."))<cr>
