module Test exposing (..)


addElemInList : a -> number -> List a -> List a
addElemInList elem times list =
    if times == 0 then
        list
    else
        addElemInList elem (times - 1) (elem :: list)

dupli : List a -> List a
dupli list =
    List.foldr (\elem acc -> addElemInList elem 2 acc) [] list

