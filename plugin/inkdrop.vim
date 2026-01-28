function! s:define(name, default) abort
  let g:{a:name} = get(g:, a:name, a:default)
endfunction

call s:define('inkdrop_disable_default_mappings', 0)

augroup inkdrop_plugin_internal
  autocmd!
  autocmd User DenopsPluginPost:inkdrop call inkdrop#setup#commands()
  autocmd User DenopsPluginPost:inkdrop call inkdrop#setup#maps()
augroup END
