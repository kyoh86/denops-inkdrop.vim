nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open) <cmd>call inkdrop#buffer_action#tags_list#open(line("."))<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-new) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-above"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-vnew) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-vnew-left) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-vnew-right) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-right"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-open-tabedit) <cmd>call inkdrop#buffer_action#tags_list#open(line("."), {"split": "split-tab"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-refresh) <cmd>call inkdrop#buffer_action#tags_list#refresh()<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-tags-list-rename) <cmd>call inkdrop#buffer_action#tags_list#rename(line("."))<cr>
