function! inkdrop#login()
  call denops#notify("inkdrop", "login", [])
endfunction

function! inkdrop#logout()
  call denops#notify("inkdrop", "logout", [])
endfunction

function! inkdrop#notes(q)
  if empty(a:q)
    call denops#notify("inkdrop", "router:open", ["notes-list"])
  else
    call denops#notify("inkdrop", "router:open", ["notes-list", {"q": a:q}])
  endif
endfunction

function! inkdrop#new()
  call denops#notify("inkdrop", "newNote", [])
endfunction

function! inkdrop#books()
  call denops#notify("inkdrop", "books", [])
endfunction

function! inkdrop#menu()
  call denops#notify("inkdrop", "menu", [])
endfunction

function! inkdrop#tags()
  call denops#notify("inkdrop", "tags", [])
endfunction

function! inkdrop#edit_tags()
  call denops#notify("inkdrop", "tagEdit", [])
endfunction

function! inkdrop#rename_book()
  call inkdrop#buffer_action#books_list#rename(line("."))
endfunction

function! inkdrop#rename_tag()
  call inkdrop#buffer_action#tags_list#rename(line("."))
endfunction

function! inkdrop#note_status()
  call denops#notify("inkdrop", "noteStatus", [])
endfunction

function! inkdrop#note_delete()
  call denops#notify("inkdrop", "noteDelete", [])
endfunction

function! inkdrop#move_note()
  call denops#notify("inkdrop", "noteBook", [])
endfunction
