function! inkdrop#buffer_action#notes_list#open(lnum, open_option={})
  call denops#request("inkdrop", "router:action", [bufnr(), "open", {"lnum": a:lnum, "open_option": a:open_option}])
endfunction

function! inkdrop#buffer_action#notes_list#prev()
  call denops#request("inkdrop", "router:action", [bufnr(), "prev", {}])
endfunction

function! inkdrop#buffer_action#notes_list#next()
  call denops#request("inkdrop", "router:action", [bufnr(), "next", {}])
endfunction

function! inkdrop#buffer_action#notes_list#refresh()
  call denops#request("inkdrop", "router:action", [bufnr(), "refresh", {}])
endfunction
