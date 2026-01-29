function! inkdrop#buffer_action#books_list#open(lnum, open_option={})
  call denops#request("inkdrop", "router:action", [bufnr(), "open", {"lnum": a:lnum, "open_option": a:open_option}])
endfunction

function! inkdrop#buffer_action#books_list#refresh()
  call denops#request("inkdrop", "router:action", [bufnr(), "refresh", {}])
endfunction
