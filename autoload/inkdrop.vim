function! inkdrop#login()
  call denops#notify("inkdrop", "login", [])
endfunction

function! inkdrop#logout()
  call denops#notify("inkdrop", "logout", [])
endfunction

function! s:warn(message) abort
  echohl WarningMsg
  echomsg a:message
  echohl None
endfunction

function! s:require_note_context(action) abort
  if !exists("b:inkdrop_note_id") || empty(b:inkdrop_note_id)
    call s:warn("Inkdrop: " . a:action . " requires a note buffer.")
    return v:false
  endif
  return v:true
endfunction

function! s:require_filetype(filetype, action) abort
  if &filetype !=# a:filetype
    call s:warn("Inkdrop: " . a:action . " requires " . a:filetype . ".")
    return v:false
  endif
  return v:true
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

function! inkdrop#new_book()
  call denops#notify("inkdrop", "newBook", [])
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
  if !s:require_note_context("InkdropEditTags")
    return
  endif
  call denops#notify("inkdrop", "tagEdit", [])
endfunction

function! inkdrop#rename_book()
  if !s:require_filetype("inkdrop_books_list", "InkdropRenameBook")
    return
  endif
  call inkdrop#buffer_action#books_list#rename(line("."))
endfunction

function! inkdrop#rename_tag()
  if !s:require_filetype("inkdrop_tags_list", "InkdropRenameTag")
    return
  endif
  call inkdrop#buffer_action#tags_list#rename(line("."))
endfunction

function! inkdrop#note_status()
  if !s:require_note_context("InkdropNoteStatus")
    return
  endif
  call denops#notify("inkdrop", "noteStatus", [])
endfunction

function! inkdrop#note_delete()
  if !s:require_note_context("InkdropDeleteNote")
    return
  endif
  call denops#notify("inkdrop", "noteDelete", [])
endfunction

function! inkdrop#move_note()
  if !s:require_note_context("InkdropMoveNote")
    return
  endif
  call denops#notify("inkdrop", "noteBook", [])
endfunction
