nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open) <cmd>call inkdrop#buffer_action#books_list#open(line("."))<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open-new) <cmd>call inkdrop#buffer_action#books_list#open(line("."), {"split": "split-above"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open-vnew) <cmd>call inkdrop#buffer_action#books_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open-vnew-left) <cmd>call inkdrop#buffer_action#books_list#open(line("."), {"split": "split-left"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open-vnew-right) <cmd>call inkdrop#buffer_action#books_list#open(line("."), {"split": "split-right"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-open-tabedit) <cmd>call inkdrop#buffer_action#books_list#open(line("."), {"split": "split-tab"})<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-refresh) <cmd>call inkdrop#buffer_action#books_list#refresh()<cr>
nnoremap <buffer> <plug>(inkdrop-buffer-action-books-list-rename) <cmd>call inkdrop#buffer_action#books_list#rename(line("."))<cr>
