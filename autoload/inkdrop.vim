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
