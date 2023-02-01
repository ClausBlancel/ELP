module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, div, input, text, button)
import Html.Events exposing (onInput, onClick)
import Json.Decode exposing (Decoder, field, list, map2, string, map, decodeString)
import Http
import Html.Attributes exposing (type_)
import Debug exposing (toString)
import List exposing (foldl)


-- MAIN

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

-- MODEL

type alias Model = 
    { wordToFind : String
    , checkboxState : Bool
    , words : List Word }

init : () -> ( Model, Cmd Msg )
init model =
    ( { wordToFind = "" 
    , checkboxState = False 
    , words = []}
    , getMeanings "hello")



-- UPDATE

type Msg = 
    Check
    | Change String
    | GotWords (Result Http.Error (List Word))


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        Check ->
            ( { model | checkboxState = not model.checkboxState }, Cmd.none )

        Change wordToFind ->
            ( { model | wordToFind = wordToFind }, Cmd.none)

        GotWords result ->
            case result of
                Ok words ->
                    ( { model | words = words }, Cmd.none )

                Err error ->
                    ( model, Cmd.none )

-- VIEW

view : Model -> Html Msg
view model =
    div []
    [ div [] [ text (if model.checkboxState then "hello" else "Mot mystère") ]
    , div [] [ text (if model.wordToFind == "hello" then "Bien joué" else "Essaye de trouver") ]
    , input [ type_ "text", onInput Change ] []
    , input [ type_ "checkbox", onClick Check ] []
    , div [] (List.map (\word ->
        div [] (List.map (\meaning ->
            div [] [ text meaning.partOfSpeech
            , div [] (List.map (\definition ->
                div [] [ text definition.definition ]
            )meaning.definitions)]
        )word.meanings)
    )model.words)
    ]

-- SUBSCRIPTIONS    

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

-- HTTP

getMeanings : String -> Cmd Msg
getMeanings word = 
    Http.get {
        url = ("https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word)
        , expect = Http.expectJson GotWords fullDecoder
    }

fullDecoder : Decoder (List Word)
fullDecoder =
    (list wordDecoder)

type alias Word =
    { meanings : List Meaning }

wordDecoder : Decoder Word
wordDecoder = 
    map Word
        (field "meanings" (list meanDecoder))

type alias Meaning =
    { partOfSpeech : String
    , definitions : List Definition
    }

meanDecoder : Decoder Meaning
meanDecoder =
    map2 Meaning
        (field "partOfSpeech" string)
        (field "definitions" (list definitionDecoder))

type alias Definition =
    { definition : String }

definitionDecoder : Decoder Definition
definitionDecoder = 
    map Definition
        (field "definition" string)

-- liste[dictionnaire{string, liste[dictionnaire{string, string, liste[], liste[]}]}]