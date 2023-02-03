module Main exposing (..)

import Browser
import Http
import Random
import Html exposing (Html, div, input, text, h1)
import Html.Events exposing (onInput, onClick)
import Json.Decode exposing (Decoder, field, list, map2, string, map)
import Html.Attributes exposing (type_, style)


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
    , guessedWord : String
    , checkboxState : Bool
    , wordsDefs : List Word
    , wordsList : List String }

init : () -> ( Model, Cmd Msg )
init _ =
    ( { wordToFind = "" 
    , guessedWord = ""
    , checkboxState = False 
    , wordsDefs = []
    , wordsList = []}
    , getAllWords )



-- UPDATE

type Msg = 
    Check
    | Change String
    | GotWordsDefs (Result Http.Error (List Word))
    | GotAllWords (Result Http.Error String)
    | WordRand Int


update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        Check ->
            ( { model | checkboxState = not model.checkboxState }, Cmd.none )

        Change guessedWord ->
            ( { model | guessedWord = guessedWord }, Cmd.none)

        GotWordsDefs result ->
            case result of
                Ok words ->
                    ( { model | wordsDefs = words }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        GotAllWords result ->
            case result of
                Ok wordList ->
                    ({model | wordsList = String.split " " wordList  }, Random.generate WordRand (Random.int 1 1000))
                Err _ ->
                    ( model, Cmd.none)

        WordRand index ->
            case (getElementAtIndex model.wordsList index) of
                  Nothing -> 
                      (model, Cmd.none)
                  Just wordSelected -> 
                      ({ model | wordToFind = wordSelected}, getMeanings wordSelected)

-- VIEW

view : Model -> Html Msg
view model =
    div []
    [ h1 [] [ text (if model.checkboxState then model.wordToFind else "Devinez le mot !") ]
    , div [] (List.map (\word ->
        div [] (List.map (\meaning ->
            div [] [ text meaning.partOfSpeech
            , div [] (List.map (\definition ->
                div [ style "padding-left" "3cm", style "padding-bottom" "0.5cm" ] [ text definition.definition ]
            )meaning.definitions)]
        )word.meanings)
    )model.wordsDefs)
    , div [ style "font-size" "20px", style "padding-bottom" "0.25cm" ] [ text (if model.guessedWord == model.wordToFind then "Bien joué !" else "Essaye de trouver le mot") ]
    , input [ type_ "text", onInput Change ] []
    , input [ type_ "checkbox", onClick Check ] []
    ]

-- SUBSCRIPTIONS    

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none

-- HTTP

getElementAtIndex : List a -> Int -> Maybe a
getElementAtIndex list index =
    if index < 0 || index >= List.length list then
        Nothing
    else
        List.head (List.drop index list)

getMeanings : String -> Cmd Msg
getMeanings word = 
    Http.get {
        url = ("https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word)
        , expect = Http.expectJson GotWordsDefs fullDecoder
    }

getAllWords : Cmd Msg
getAllWords =
    Http.get
      { url = "http://localhost:5500/ELM/src/thousand_words_things_explainer.txt"
      , expect = Http.expectString GotAllWords
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