nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open) <cmd>call inkdrop#buffer_action#tags_list#open(line("."))<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-new) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-above"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-vnew) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-tabedit) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-tab"})<cr>
