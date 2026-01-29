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

function! inkdrop#tags()
  call denops#notify("inkdrop", "tags", [])
endfunction

function! inkdrop#tag_edit()
  call denops#notify("inkdrop", "tagEdit", [])
endfunction
