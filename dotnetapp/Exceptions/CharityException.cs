using System;

namespace dotnetapp.Exceptions
{
    public class CharityException : Exception
    {
        public CharityException(string message) : base(message) { }
    }
}