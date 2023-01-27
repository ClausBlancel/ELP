module Main exposing (..)

import Browser
import Html exposing (Html, Attribute, div, input, text, button)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import Json.Decode exposing (Decoder, field, list)
import Http


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
    , definition : String }

init : () -> ( Model, Cmd Msg )
init model =
    ( { wordToFind = "" 
    , checkboxState = False 
    , definition = ""}
    , getDefinition "hello")



-- UPDATE

type Msg = 
    Check
    | Change String
    | GotText (Result Http.Error String)

getDefinition : String -> Cmd Msg
getDefinition word = 
    Http.get {
        url = ("https://api.dictionaryapi.dev/api/v2/entries/en/" ++ word)
        , expect = Http.expectString GotText
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = 
    case msg of
        Check ->
            ( { model | checkboxState = not model.checkboxState }, Cmd.none )

        Change wordToFind ->
            ( { model | wordToFind = wordToFind }, Cmd.none)

        GotText (Ok definition) ->
            ( { model | definition = definition }, Cmd.none)

        GotText (Err err) ->
            ( model, Cmd.none )



-- VIEW

view : Model -> Html Msg
view model =
    div []
    [ div [] [ text (if model.checkboxState then "hello" else "Mot mystère") ]
    , div [] [ text (if model.wordToFind == "hello" then "Bien joué" else "Essaye de trouver") ]
    , input [ type_ "text", onInput Change ] []
    , input [ type_ "checkbox", onClick Check ] []
    , div [] [ text model.definition ]
    ]

-- SUBSCRIPTIONS    

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none