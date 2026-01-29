function! inkdrop#buffer_action#menu_list#open(lnum)
  call denops#request("inkdrop", "router:action", [bufnr(), "open", {"lnum": a:lnum}])
endfunction
